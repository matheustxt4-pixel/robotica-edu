import { LegoBrick, LegoBrickType } from '../types';

export const LEGO_UNIT = 1; // Unidade Padrão Global da Grade em Studs

export interface BrickDimensions {
  w: number; // Largura em studs (0°)
  d: number; // Profundidade em studs (0°)
  h: number; // Altura em camadas Z
}

// Definições físicas padronizadas de todos os blocos LEGO derivados da LEGO_UNIT
export const BRICK_DEFINITIONS: Record<LegoBrickType, BrickDimensions> = {
  '1x1': { w: 1, d: 1, h: 1 },
  '2x1': { w: 2, d: 1, h: 1 },
  '2x2': { w: 2, d: 2, h: 1 },
  '2x4': { w: 2, d: 4, h: 1 },
  '4x4': { w: 4, d: 4, h: 1 },
  'window': { w: 2, d: 2, h: 2 },
  'slope': { w: 2, d: 2, h: 1 },
  'roof': { w: 2, d: 2, h: 1 },
  'robot_head': { w: 2, d: 2, h: 1 }
};

export interface Footprint {
  w: number;
  d: number;
  h: number;
}

export interface StudPosition {
  x: number;
  y: number;
  z: number;
}

export interface SnapResult {
  x: number;
  y: number;
  z: number;
  status: 'VALID' | 'INVALID';
  reason?: string;
}

class LegoEngine {
  /**
   * Obtém a pegada (W, D, H) de um bloco levando em conta a rotação (0°, 90°, 180°, 270°)
   */
  public getFootprint(type: LegoBrickType, rotation: number): Footprint {
    const def = BRICK_DEFINITIONS[type] || BRICK_DEFINITIONS['2x2'];
    const normRot = ((rotation % 360) + 360) % 360;

    if (normRot === 90 || normRot === 270) {
      return { w: def.d, d: def.w, h: def.h };
    }
    return { w: def.w, d: def.d, h: def.h };
  }

  /**
   * Gera todas as células ocupadas no Voxel Grid 3D por um bloco posicionado em (x, y, z)
   */
  public getOccupiedVoxels(x: number, y: number, z: number, footprint: Footprint): StudPosition[] {
    const voxels: StudPosition[] = [];
    for (let dx = 0; dx < footprint.w; dx++) {
      for (let dy = 0; dy < footprint.d; dy++) {
        for (let dz = 0; dz < footprint.h; dz++) {
          voxels.push({ x: x + dx, y: y + dy, z: z + dz });
        }
      }
    }
    return voxels;
  }

  /**
   * Obtém as posições dos pinos superiores (Top Studs) oferecidos pelo bloco no seu topo
   */
  public getTopStuds(x: number, y: number, z: number, footprint: Footprint): StudPosition[] {
    const studs: StudPosition[] = [];
    const topZ = z + footprint.h - 1;
    for (let dx = 0; dx < footprint.w; dx++) {
      for (let dy = 0; dy < footprint.d; dy++) {
        studs.push({ x: x + dx, y: y + dy, z: topZ });
      }
    }
    return studs;
  }

  /**
   * Obtém as cavidades inferiores (Bottom Sockets) da base do bloco
   */
  public getBottomSockets(x: number, y: number, z: number, footprint: Footprint): StudPosition[] {
    const sockets: StudPosition[] = [];
    for (let dx = 0; dx < footprint.w; dx++) {
      for (let dy = 0; dy < footprint.d; dy++) {
        sockets.push({ x: x + dx, y: y + dy, z });
      }
    }
    return sockets;
  }

  /**
   * Verifica se há colisão física de volume entre o candidato e qualquer bloco existente
   */
  public checkCollision(
    candX: number,
    candY: number,
    candZ: number,
    candFootprint: Footprint,
    existingBricks: LegoBrick[],
    excludeId?: string
  ): boolean {
    const candVoxels = this.getOccupiedVoxels(candX, candY, candZ, candFootprint);

    for (const b of existingBricks) {
      if (b.id === excludeId) continue;
      const bFootprint = this.getFootprint(b.type, b.rotation);
      const bVoxels = this.getOccupiedVoxels(b.x, b.y, b.z, bFootprint);

      // Verificar se há interseção de células
      for (const cv of candVoxels) {
        for (const bv of bVoxels) {
          if (cv.x === bv.x && cv.y === bv.y && cv.z === bv.z) {
            return true; // Colisão detectada!
          }
        }
      }
    }
    return false;
  }

  /**
   * Calcula a altura Z de suporte apropriada para encaixe no ponto (candX, candY)
   */
  public calculateSupportZ(
    candX: number,
    candY: number,
    candFootprint: Footprint,
    existingBricks: LegoBrick[],
    excludeId?: string
  ): number {
    let maxSupportZ = 0; // Se não houver nada abaixo, apoia na baseplate (Z = 0)

    for (const b of existingBricks) {
      if (b.id === excludeId) continue;
      const bFootprint = this.getFootprint(b.type, b.rotation);

      // Verificar se a pegada do candidato sobrepõe a pegada do bloco existente b nas coordenadas X, Y
      const overlapX = candX < b.x + bFootprint.w && candX + candFootprint.w > b.x;
      const overlapY = candY < b.y + bFootprint.d && candY + candFootprint.d > b.y;

      if (overlapX && overlapY) {
        const topOfB = b.z + bFootprint.h;
        if (topOfB > maxSupportZ) {
          maxSupportZ = topOfB;
        }
      }
    }

    return maxSupportZ;
  }

  /**
   * Valida estritamente se o ponto de encaixe (candX, candY, candZ) é seguro e válido.
   * Suporta pontes entre múltiplos blocos e apoios parciais!
   */
  public validateSnap(
    candX: number,
    candY: number,
    candZ: number,
    type: LegoBrickType,
    rotation: number,
    gridSize: number,
    existingBricks: LegoBrick[],
    excludeId?: string
  ): SnapResult {
    const footprint = this.getFootprint(type, rotation);

    // 1. Verificar limites da baseplate (0 <= X < gridSize)
    if (
      candX < 0 ||
      candY < 0 ||
      candX + footprint.w > gridSize ||
      candY + footprint.d > gridSize
    ) {
      return { x: candX, y: candY, z: candZ, status: 'INVALID', reason: 'Fora da baseplate' };
    }

    // 2. Verificar colisão física de volume
    if (this.checkCollision(candX, candY, candZ, footprint, existingBricks, excludeId)) {
      return { x: candX, y: candY, z: candZ, status: 'INVALID', reason: 'Colisão com outro bloco' };
    }

    // 3. Se Z == 0, apoia diretamente na baseplate verde (Sempre válido)
    if (candZ === 0) {
      return { x: candX, y: candY, z: 0, status: 'VALID' };
    }

    // 4. Se Z > 0, deve ter suporte de pinos inferiores (Bottom Sockets) sobre Top Studs no nível Z - 1
    const bottomSockets = this.getBottomSockets(candX, candY, candZ, footprint);
    const requiredZ = candZ - 1;

    // Coletar todos os Top Studs disponíveis no nível Z - 1 oferecidos pelos blocos existentes
    const availableStuds: StudPosition[] = [];
    existingBricks.forEach(b => {
      if (b.id === excludeId) return;
      const bFootprint = this.getFootprint(b.type, b.rotation);
      const studs = this.getTopStuds(b.x, b.y, b.z, bFootprint);
      studs.forEach(st => {
        if (st.z === requiredZ) {
          availableStuds.push(st);
        }
      });
    });

    // Contar quantas cavidades inferiores do candidato assentam em pinos válidos
    let supportedSocketsCount = 0;
    for (const socket of bottomSockets) {
      const hasStudBelow = availableStuds.some(st => st.x === socket.x && st.y === socket.y);
      if (hasStudBelow) {
        supportedSocketsCount++;
      }
    }

    // REGRA DE ENCAIXE: Pelo menos 1 pino de suporte DEVE existir, e não pode ter cavidades flutuando sem suporte!
    if (supportedSocketsCount === 0) {
      return { x: candX, y: candY, z: candZ, status: 'INVALID', reason: 'Flutuando sem suporte de pinos' };
    }

    // Caso de Suporte Válido (Direto ou Ponte entre vários blocos!)
    return { x: candX, y: candY, z: candZ, status: 'VALID' };
  }

  /**
   * Encontra a posição e estado de snap perfeitos para o cursor/hover
   */
  public findSnapPoint(
    targetX: number,
    targetY: number,
    type: LegoBrickType,
    rotation: number,
    gridSize: number,
    existingBricks: LegoBrick[],
    excludeId?: string
  ): SnapResult {
    const footprint = this.getFootprint(type, rotation);
    const candZ = this.calculateSupportZ(targetX, targetY, footprint, existingBricks, excludeId);

    return this.validateSnap(
      targetX,
      targetY,
      candZ,
      type,
      rotation,
      gridSize,
      existingBricks,
      excludeId
    );
  }
}

export const legoEngine = new LegoEngine();


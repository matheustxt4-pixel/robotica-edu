import React, { useState, useEffect } from 'react';
import { LegoPost } from '../../types';
import { legoService } from '../../services/legoService';
import { LegoBrickSvg } from './LegoBrickSvg';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { Avatar } from '../ui/Avatar';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ClassmateMascotModal } from '../ui/ClassmateMascotModal';
import { Heart, Sparkles, ShieldAlert, Trophy, Layers, Eye } from 'lucide-react';

interface LegoFeedProps {
  onGoToStudio?: () => void;
}

export const LegoFeed: React.FC<LegoFeedProps> = ({ onGoToStudio }) => {
  const { user } = useAuth();
  const { playSound } = useAudio();

  const [posts, setPosts] = useState<LegoPost[]>([]);
  const [likeAnimId, setLikeAnimId] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<{
    nickname: string;
    avatar: string;
    mascot?: string;
    mascotColor?: any;
    mascotBackground?: string;
    equippedAccessories?: any;
    grade?: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = legoService.subscribeToLegoPosts(user?.classId, (newPosts) => {
      setPosts(newPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.classId]);

  // Alternar Curtida ❤️ no Post
  const handleToggleLike = async (postId: string) => {
    if (!user) return;
    playSound('correct');
    setLikeAnimId(postId);

    const updated = await legoService.toggleLike(postId, user.uid);
    if (updated) {
      setPosts(prev => prev.map(p => (p.id === postId ? updated : p)));
    }

    setTimeout(() => setLikeAnimId(null), 700);
  };

  return (
    <div className="space-y-6 font-display max-w-4xl mx-auto select-none">
      {/* HEADER DA REDE SOCIAL DA TURMA */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 rounded-3xl border-4 border-purple-300 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="bg-amber-400 text-amber-950 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-sm">
              Mural da Turma 🌟
            </span>
            <span className="text-xs font-bold text-purple-200">Exclusivo para Alunos</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">Galeria de Criações LEGO 🧱</h2>
          <p className="text-xs font-extrabold text-purple-100 max-w-lg">
            Veja o que seus colegas de classe montaram no estúdio e clique no perfil para ver o **mascote** deles!
          </p>
        </div>

        {onGoToStudio && (
          <Button
            variant="yellow"
            size="lg"
            onClick={onGoToStudio}
            icon={<Sparkles className="w-5 h-5 fill-amber-950" />}
            className="font-black shadow-3d-yellow hover:scale-105 active:scale-95 flex-shrink-0"
          >
            Criar Minha Peça 🧩
          </Button>
        )}
      </div>

      {/* REVISÃO DA REGRA DE OURO DA REDE SOCIAL */}
      <div className="bg-amber-50 border-2 border-amber-300 text-amber-950 p-4 rounded-3xl shadow-sm flex items-center gap-3 text-xs font-bold">
        <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0" />
        <span>
          <strong>Regra de Segurança do Mural:</strong> Apenas construções 3D originais criadas no nosso Estúdio LEGO podem ser publicadas aqui. Divirta-se construindo!
        </span>
      </div>

      {/* LISTA DE POSTS NO FEED DA TURMA */}
      {loading ? (
        <Card variant="white" className="p-12 text-center space-y-3 border-4 border-slate-200 shadow-md">
          <div className="w-10 h-10 border-4 border-robo-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-extrabold text-slate-600 text-sm">Carregando criações da turma...</p>
        </Card>
      ) : posts.length === 0 ? (
        <Card variant="white" className="p-12 text-center space-y-4 border-4 border-slate-200 shadow-md">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 border-4 border-slate-300 text-4xl mx-auto flex items-center justify-center shadow-inner">
            🧱
          </div>
          <h3 className="text-xl font-black text-slate-800">Nenhuma criação publicada ainda!</h3>
          <p className="text-xs font-bold text-slate-500 max-w-md mx-auto">
            Seja o primeiro aluno da turma a construir e publicar uma obra de arte no estúdio de blocos!
          </p>
          {onGoToStudio && (
            <Button variant="green" size="lg" onClick={onGoToStudio} className="font-black shadow-3d-green">
              Ir para a Oficina LEGO 🧱
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => {
            const likesCount = (post.likes || []).length;
            const hasLiked = user?.uid ? (post.likes || []).includes(user.uid) : false;

            return (
              <Card
                key={post.id}
                variant="white"
                className="p-5 border-4 border-slate-200 rounded-3xl space-y-4 shadow-xl hover:border-robo-blue transition-colors relative overflow-hidden"
              >
                {/* Cabeçalho do Post: Autor, Avatar, Mascote e Turma */}
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                  <div
                    onClick={() =>
                      setSelectedAuthor({
                        nickname: post.authorName,
                        avatar: post.authorAvatar,
                        mascot: post.authorMascot,
                        mascotColor: post.authorMascotColor,
                        mascotBackground: post.authorMascotBackground,
                        equippedAccessories: post.authorEquippedAccessories,
                        grade: post.grade
                      })
                    }
                    className="flex items-center gap-3 cursor-pointer group"
                    title="Clique para ver o mascote deste colega"
                  >
                    <Avatar avatarId={post.authorAvatar} size="md" />
                    <div>
                      <h4 className="font-black text-slate-800 text-sm leading-tight flex items-center gap-1.5 group-hover:text-robo-blue transition-colors">
                        <span>{post.authorName}</span>
                        <span className="text-[10px] font-black bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full border border-purple-300">
                          {post.grade}º Ano
                        </span>
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <span>Publicado em {new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <span className="text-sky-600 font-extrabold flex items-center gap-0.5">
                          <Eye className="w-3 h-3" /> Ver Mascote
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedAuthor({
                        nickname: post.authorName,
                        avatar: post.authorAvatar,
                        mascot: post.authorMascot,
                        mascotColor: post.authorMascotColor,
                        mascotBackground: post.authorMascotBackground,
                        equippedAccessories: post.authorEquippedAccessories,
                        grade: post.grade
                      })
                    }
                    className="w-10 h-10 rounded-2xl bg-amber-100 border-2 border-amber-300 hover:border-amber-400 text-amber-950 font-black text-base flex items-center justify-center shadow-xs transition-transform hover:scale-105"
                    title="Ver Mascote do Autor"
                  >
                    {post.authorMascot === 'byte' ? '⚙️' : post.authorMascot === 'volt' ? '⚡' : post.authorMascot === 'spark' ? '🧩' : '🤖'}
                  </button>
                </div>

                {/* Título da Obra */}
                <div className="space-y-1">
                  <h3 className="font-black text-lg text-slate-900 leading-snug">{post.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <Layers className="w-3.5 h-3.5 text-robo-blue" />
                    <span>Construído com {post.bricks.length} blocos LEGO</span>
                  </div>
                </div>

                {/* VISUALIZAÇÃO DA CONSTRUÇÃO 3D NO CARTÃO */}
                <div className="w-full h-56 bg-gradient-to-b from-sky-50 via-slate-100 to-amber-50 rounded-2xl border-2 border-slate-200 relative overflow-hidden flex items-center justify-center p-4">
                  <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                    {[...post.bricks]
                      .sort((a, b) => a.z - b.z || (a.y + a.x) - (b.y + b.x) || a.y - b.y)
                      .map(b => (
                        <div
                          key={b.id}
                          className="absolute pointer-events-none"
                          style={{
                            left: `${(b.x - b.y) * 12 + 130}px`,
                            top: `${(b.x + b.y) * 7 - b.z * 14 + 50}px`,
                            zIndex: b.z * 100 + (b.y + b.x) * 5
                          }}
                        >
                          <LegoBrickSvg
                            type={b.type}
                            color={b.color}
                            sizeMultiplier={0.55}
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {/* RODAPÉ DO POST: BOTÃO DE CURTIR E INTERAÇÃO */}
                <div className="pt-2 flex items-center justify-between border-t-2 border-slate-100">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs transition-transform active:scale-95 border-2 ${
                      hasLiked
                        ? 'bg-rose-500 text-white border-rose-400 shadow-3d-red'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600'
                    } ${likeAnimId === post.id ? 'animate-bounce-small' : ''}`}
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
                    <span>{likesCount} {likesCount === 1 ? 'Curtida' : 'Curtidas'}</span>
                  </button>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Criação Oficial da Turma</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Mascote do Autor */}
      <ClassmateMascotModal
        student={selectedAuthor}
        onClose={() => setSelectedAuthor(null)}
      />
    </div>
  );
};

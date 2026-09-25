import React from 'react';
import { Activity } from '../../types';
import { MultipleChoiceActivity } from './MultipleChoiceActivity';
import { TrueFalseActivity } from './TrueFalseActivity';
import { OrderingActivity } from './OrderingActivity';
import { MatchingActivity } from './MatchingActivity';

export interface ActivityEngineProps {
  activity: Activity;
  onAnswer: (isCorrect: boolean) => void;
}

export const ActivityEngine: React.FC<ActivityEngineProps> = ({ activity, onAnswer }) => {
  switch (activity.type) {
    case 'multiple-choice':
    case 'image-choice':
      return <MultipleChoiceActivity activity={activity} onAnswer={onAnswer} />;

    case 'true-false':
      return <TrueFalseActivity activity={activity} onAnswer={onAnswer} />;

    case 'ordering':
      return <OrderingActivity activity={activity} onAnswer={onAnswer} />;

    case 'matching':
      return <MatchingActivity activity={activity} onAnswer={onAnswer} />;

    default:
      return <MultipleChoiceActivity activity={activity} onAnswer={onAnswer} />;
  }
};


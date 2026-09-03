import React from 'react';
import { LuxuryClothIntro } from './LuxuryClothIntro';

interface CinematicWelcomeProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const CinematicWelcome: React.FC<CinematicWelcomeProps> = ({ onComplete, forceShow = false }) => {
  return <LuxuryClothIntro onComplete={onComplete} forceShow={forceShow} />;
};

export default CinematicWelcome;

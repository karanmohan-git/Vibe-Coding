/**
 * Algebra Module Component
 *
 * This component provides an interactive algebra learning experience for children ages 6-8.
 * It focuses on basic algebraic concepts like solving for missing numbers in simple equations,
 * introducing mathematical thinking in an age-appropriate way.
 */
import React, { useState } from 'react';
import AlgebraProblem from './AlgebraProblem';
import AlgebraFeedback from './AlgebraFeedback';
import { 
  RiBrainLine, 
  RiLightbulbLine, 
  RiArrowDownLine, 
  RiCheckLine, 
  RiArrowRightLine, 
  RiLockLine,
  RiStarLine
} from 'react-icons/ri';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateAlgebraProblem } from '@/lib/algebraProblems';

/**
 * AlgebraModule Component
 * 
 * Main component for the algebra learning module that includes:
 * 1. Interactive algebra problems with varying difficulty levels
 * 2. User input for answers with validation
 * 3. Hints and detailed explanations
 * 4. Visual feedback for correct/incorrect answers
 * 5. Progress tracking and gamification elements
 */
const AlgebraModule: React.FC = () => {
  // Current algebra problem to display
  const [currentProblem, setCurrentProblem] = useState(generateAlgebraProblem(1));
  // User's input answer as a string (converted to number when checking)
  const [userAnswer, setUserAnswer] = useState('');
  // Whether to show the feedback component after checking answer
  const [showFeedback, setShowFeedback] = useState(false);
  // Whether the user's answer was correct
  const [isCorrect, setIsCorrect] = useState(false);
  // Whether to show detailed hints
  const [showHints, setShowHints] = useState(false);
  // Hook for displaying toast notifications
  const { toast } = useToast();

  /**
   * Updates the userAnswer state as the child types in the input field
   * @param e - Input change event
   */
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  /**
   * Validates and checks the user's answer against the correct answer
   * Provides appropriate feedback via toast notifications
   */
  const checkAnswer = () => {
    // Validate that an answer was provided
    if (userAnswer === '') {
      toast({
        title: "Don't forget to answer!",
        description: "Type a number in the answer box",
        variant: "destructive",
      });
      return;
    }

    // Convert the string input to a number
    const parsedAnswer = parseInt(userAnswer, 10);
    
    // Validate that the input is a number
    if (isNaN(parsedAnswer)) {
      toast({
        title: "That's not a number",
        description: "Please type a number in the answer box",
        variant: "destructive",
      });
      return;
    }

    // Check if the answer is correct
    const correct = parsedAnswer === currentProblem.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Display appropriate feedback based on correctness
    if (correct) {
      toast({
        title: "Great job!",
        description: "Your answer is correct!",
        variant: "default",
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Try again or check the hint",
        variant: "destructive",
      });
    }
  };

  /**
   * Generates a new problem and resets the module state
   * Called when user completes a problem and wants to continue
   */
  const nextProblem = () => {
    setCurrentProblem(generateAlgebraProblem(1));
    setUserAnswer('');
    setShowFeedback(false);
    setShowHints(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column: Problem and Input */}
      <div className="w-full lg:w-1/2">
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <RiBrainLine className="text-accent mr-2" />
            Algebra Challenge
          </h2>
          
          <AlgebraProblem problem={currentProblem} />
          
          <div className="mb-6">
            <label htmlFor="algebraAnswer" className="block text-lg font-bold mb-2">Your Answer:</label>
            <div className="flex items-center">
              <input 
                type="number" 
                id="algebraAnswer" 
                className="w-full text-2xl p-4 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none" 
                placeholder="Type your answer..." 
                value={userAnswer}
                onChange={handleAnswerChange}
                disabled={showFeedback && isCorrect}
              />
              <Button 
                className="ml-4 bg-primary hover:bg-opacity-90 text-white px-6 py-4 rounded-xl text-xl font-bold"
                onClick={checkAnswer}
                disabled={showFeedback && isCorrect}
              >
                Check
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-xl">
            <h3 className="font-bold text-lg mb-2 flex items-center">
              <RiLightbulbLine className="text-warning mr-2" />
              Hint
            </h3>
            <p className="text-base">{currentProblem.hint}</p>
            <button 
              className="text-primary font-bold mt-2 flex items-center"
              onClick={() => setShowHints(!showHints)}
            >
              <RiArrowDownLine className="mr-1" /> {showHints ? 'Hide hints' : 'Show more hints'}
            </button>
            
            {showHints && (
              <div className="mt-2 p-3 bg-primary bg-opacity-10 rounded-lg">
                <p>{currentProblem.detailedHint}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Right Column: Learning and Progress */}
      <div className="w-full lg:w-1/2">
        {showFeedback ? (
          <AlgebraFeedback 
            isCorrect={isCorrect} 
            problem={currentProblem} 
            userAnswer={parseInt(userAnswer, 10)} 
            onNextChallenge={nextProblem}
          />
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Your Algebra Journey</h2>
            
            <div className="flex items-center mb-6">
              <div className="w-full bg-gray-200 rounded-full h-5">
                <div className="bg-accent w-1/4 h-5 rounded-full"></div>
              </div>
              <span className="ml-4 font-bold">Level 1</span>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                <div className="bg-success text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  <RiCheckLine />
                </div>
                <div>
                  <h3 className="font-bold">Adding Numbers</h3>
                  <p className="text-sm">3 of 3 completed</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-primary bg-opacity-10 rounded-lg border-l-4 border-primary">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  <RiArrowRightLine />
                </div>
                <div>
                  <h3 className="font-bold">Missing Numbers</h3>
                  <p className="text-sm">1 of 5 completed</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-100 rounded-lg opacity-60">
                <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  <RiLockLine />
                </div>
                <div>
                  <h3 className="font-bold">Simple Equations</h3>
                  <p className="text-sm">Locked</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-warning">
              <h3 className="font-bold text-lg flex items-center">
                <RiStarLine className="text-warning mr-2" />
                Fun Fact
              </h3>
              <p>Algebra comes from the Arabic word "al-jabr" which means "reunion of broken parts"!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgebraModule;

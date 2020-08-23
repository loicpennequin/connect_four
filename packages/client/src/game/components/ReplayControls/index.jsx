import React from 'react';

export function ReplayControls({ controls }) {
  return <div>
    <button onClick={controls.goToFirstStep}>First</button>
    <button onClick={controls.goToPreviousStep}>Previous</button>
    <button onClick={controls.goToNextStep}>Next</button>
    <button onClick={controls.goToLastStep}>Last</button>
  </div>
}
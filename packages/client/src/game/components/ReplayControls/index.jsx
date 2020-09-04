import React from 'react';
import { Flex } from '@core/components/Flex';
import { Button } from '@core/components/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faForward,
  faStepForward,
  faBackward,
  faStepBackward
} from '@fortawesome/free-solid-svg-icons';

export function ReplayControls({ controls }) {
  return (
    <Flex justify="space-around">
      <Button onClick={controls.first} plain>
        <FontAwesomeIcon icon={faStepBackward} size="2x" />
      </Button>
      <Button onClick={controls.previous} plain>
        <FontAwesomeIcon icon={faBackward} size="2x" />
      </Button>
      <Button onClick={controls.next} plain>
        <FontAwesomeIcon icon={faForward} size="2x" />
      </Button>
      <Button onClick={controls.last} plain>
        <FontAwesomeIcon icon={faStepForward} size="2x" />
      </Button>
    </Flex>
  );
}

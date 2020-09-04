import { useRef, useEffect, useCallback } from 'react';
import deepEqual from 'fast-deep-equal';
import { useQuery, useMutation } from 'react-query';
import { isDefined } from '@c4/shared';

import { useForceUpdate } from '@core/hooks/useForceUpdate';

import { GameService } from '@game/api/GameService';

import { ReplayService } from '@game/api/ReplayService';
import { Tree } from '@core/api/Tree';

export function useReplay(gameId) {
  const tree = useRef();
  const forceUpdate = useForceUpdate();
  const [handleNewAction] = useMutation(ReplayService.getStateFromNewAction, {
    onError(err) {
      throw err;
    }
  });

  const game = useQuery(
    ['game', gameId],
    async () => {
      return GameService.getGameById(gameId);
    },
    { retry: false }
  );

  useEffect(() => {
    const treeInstance = tree.current;
    if (isDefined(game.data) && !isDefined(treeInstance)) {
      tree.current = new Tree(game.data.history);
      tree.current.first();
      forceUpdate();
    }
  }, [forceUpdate, game.data]);

  const previous = useCallback(() => {
    const treeInstance = tree.current;
    treeInstance.previous();
    forceUpdate();
  }, [forceUpdate]);

  const next = useCallback(() => {
    const treeInstance = tree.current;
    treeInstance.next();
    forceUpdate();
  }, [forceUpdate]);

  const first = useCallback(() => {
    const treeInstance = tree.current;
    treeInstance.first();
    forceUpdate();
  }, [forceUpdate]);

  const last = useCallback(() => {
    const treeInstance = tree.current;
    treeInstance.last();
    forceUpdate();
  }, [forceUpdate]);

  const goToNode = useCallback(
    node => {
      const treeInstance = tree.current;
      treeInstance.goToNode(node);
      forceUpdate();
    },
    [forceUpdate]
  );

  const currentNode = tree.current?.currentNode;

  const addNode = useCallback(
    async column => {
      const treeInstance = tree.current;
      const newState = await handleNewAction({
        state: currentNode.value,
        column
      });
      const currentStepIndex = treeInstance.currentPath.currentStepIndex;
      const isDuplicate = treeInstance.paths.some(path => {
        return deepEqual(path.steps[currentStepIndex + 1]?.value?.board, newState.board)
      }
      );
      if (!isDuplicate) {
        treeInstance.addNode(newState);
      } 
      treeInstance.next();
      forceUpdate();
    },
    [currentNode, forceUpdate, handleNewAction]
  );

  return {
    isLoading: game.isLoading,
    tree: tree.current,
    previous,
    next,
    first,
    last,
    goToNode,
    addNode,
    currentNode
  };
}

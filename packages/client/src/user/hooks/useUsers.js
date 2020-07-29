import { useMemo } from 'react';
import { userActions } from '@user/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { UserService } from '@user/api/UserService';

export function useUsers() {
  const dispatch = useDispatch();
  
  const users = useSelector(state => Object.values(state.users.usersById));
  const isLoading = useSelector(state => state.users.isLoading);
  const currentUser = useSelector(
    state => state.users.usersById[state.users.currentUserId]
  );
    
  const getAllUsers = useMemo(() => async () => {
    try {
      dispatch(userActions.getUsersStart());
      const users = await UserService.getAllUsers();
      dispatch(userActions.getUsersSuccess(users));
    } catch (err) {
      dispatch(userActions.getUsersFailure(err.toString()));
    }
  }, [dispatch]);

  return {
    isLoading,
    users,
    currentUser,
    getAllUsers
  };
}

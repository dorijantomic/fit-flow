import { router } from './trpc';
import { userRouter } from './routers/user';
import { workoutRouter } from './routers/workout';

export const appRouter = router({
  user: userRouter,
  workout: workoutRouter,
});

export type AppRouter = typeof appRouter;

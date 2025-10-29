import "server-only";

/**
 * basic building block of authed procedures
 * @private do not use it anywhere else
 *
 */
// const authProcedure = createServerActionProcedure()
//   .input(
//     z.object({
//       token: z.string().optional(),
//     })
//   )
//   .handler(async ({ input }) => {
//     try {
      
//     } catch {
//       throw new Error("User not authenticated");
//     }
//   });

/**
 * Procedure that checks if the user is authenticated
 * @description no need to chain this method with createServerAction()
 */
// export const authedProcedure = authProcedure.createServerAction();

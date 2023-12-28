export default defineEventHandler(async (event: any) => {
  try {
    await sendRedirect(event, `${process.env.BACKEND_HOST}/api/tracks/`, 302);
  } catch (error: any) {
    console.error("Error redirecting:", error.message);
    throw error;
  }
});

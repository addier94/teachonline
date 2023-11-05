import { db } from "@/lib/db";


export const getProgress = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true
      }
    });

    // Extract the IDs of the published chapters and store them in an array.
    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    // Query the database to count how many chapters the user has completed.
    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds, // Check if the chapterId is in the publishedChapterIds array.
        },
        isCompleted: true
      }
    });

    const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100;

    return progressPercentage
  } catch (error) {
    console.log('[GET_PROGRESS]', error)
    return 0;
  }
}
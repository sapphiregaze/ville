import { addTrackRecords, addUserTrackRecords } from "../database/queries";

async function addTrack(userId: number, track: any) {
  const trackId: number = await addTrackRecords(track);
  await addUserTrackRecords(userId, trackId);
}

export { addTrack };

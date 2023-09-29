import { Meme } from '../types/Meme';

export async function getMemes(): Promise<{ memes: Meme[] }> {
  try {
    const { data } = await fetch('https://api.imgflip.com/get_memes', {
      method: 'GET',
    }).then((res) => res.json());

    return { memes: data.memes };
  } catch (error) {
    console.error(error);

    return { memes: [] };
  }
}

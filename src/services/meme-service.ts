import { TextNode } from './../components/Editor/types/text-node';
import { Meme } from '../types/meme';

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

const appendBoxesToSearchParams = (url: URL, nodes: TextNode[]): void => {
  nodes.forEach((node, index) => {
    const imgflipBox = {
      text: node.value,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      color: node.color,
    };

    Object.entries(imgflipBox).forEach(([key, value]) => {
      url.searchParams.append(`boxes[${index}][${key}]`, value.toString());
    });
  });
};

export async function createMeme({
  meme,
  nodes,
}: {
  meme: Meme;
  nodes: TextNode[];
}): Promise<{ data?: { url: string; page_url: string } }> {
  if (
    !process.env.REACT_APP_IMGFLIP_USERNAME ||
    !process.env.REACT_APP_IMGFLIP_PASSWORD
  ) {
    throw new Error('Missing credentials for Imgflip API');
  }

  try {
    const url = new URL('https://api.imgflip.com/caption_image');
    url.searchParams.append('template_id', meme.id);
    url.searchParams.append('username', process.env.REACT_APP_IMGFLIP_USERNAME);
    url.searchParams.append('password', process.env.REACT_APP_IMGFLIP_PASSWORD);
    appendBoxesToSearchParams(url, nodes);

    const { data } = await fetch(url, {
      method: 'POST',
    }).then((res) => res.json());

    return { data };
  } catch (error) {
    console.error(error);

    return { data: undefined };
  }
}

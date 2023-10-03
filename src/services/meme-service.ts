import { TextNode } from './../components/Editor/types/text-node';
import { Meme } from '../types/meme';
import { MAX_TEXT_NODE_WIDTH } from '../components/Editor/constants/text-node-constraints';

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

const appendBoxesToSearchParams = (
  url: URL,
  nodes: TextNode[],
  meme: Meme,
): void => {
  nodes.forEach((node, index) => {
    const widthRatio = meme.width / MAX_TEXT_NODE_WIDTH;
    const originalHeight = Math.abs(
      (meme.height * MAX_TEXT_NODE_WIDTH) / meme.width,
    );
    const heightRatio = meme.height / originalHeight;
    const y = node.y * heightRatio + (node.height * heightRatio) / 4;

    const imgflipBox = {
      text: node.value.toLocaleUpperCase(),
      x: node.x * widthRatio,
      y: y < 0 ? 0 : y,
      width: node.width * widthRatio,
      height: (node.height * heightRatio) / 2,
      color: node.color,
      outline_width: 0,
      font_size: Math.floor(node.fontSize),
      font_bold: 0,
      vertical_align: 'middle',
      text_align: 'center',
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
}): Promise<{
  data?: { url: string; page_url: string };
  error_message?: string;
}> {
  if (
    !process.env.REACT_APP_IMGFLIP_USERNAME ||
    !process.env.REACT_APP_IMGFLIP_PASSWORD
  ) {
    throw new Error('Missing credentials for Imgflip API. Make sure to add them to your .env file');
  }

  try {
    const url = new URL('https://api.imgflip.com/caption_image');
    url.searchParams.append('template_id', meme.id);
    url.searchParams.append('username', process.env.REACT_APP_IMGFLIP_USERNAME);
    url.searchParams.append('password', process.env.REACT_APP_IMGFLIP_PASSWORD);
    url.searchParams.append('font', 'arial');
    appendBoxesToSearchParams(url, nodes, meme);

    const response = await fetch(url, {
      method: 'POST',
    }).then((res) => res.json());

    return response;
  } catch (error) {
    throw new Error('Error creating meme');
  }
}

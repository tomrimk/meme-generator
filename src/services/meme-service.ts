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
    const widthDifference = meme.width / MAX_TEXT_NODE_WIDTH;
    const height = Math.abs((meme.height * MAX_TEXT_NODE_WIDTH) / meme.width);
    const heightDifference = meme.height / height;
    const y = node.y * heightDifference - node.height * heightDifference;

    const imgflipBox = {
      text: node.value.toLocaleUpperCase(),
      x: node.x * widthDifference,
      y: y < 0 ? 0 : y,
      width: node.width * widthDifference,
      height: node.height * heightDifference,
      color: node.color,
      outline_width: 0,
      font: 'arial',
      font_size: node.fontSize,
      font_bold: 1,
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
    appendBoxesToSearchParams(url, nodes, meme);

    const { data } = await fetch(url, {
      method: 'POST',
    }).then((res) => res.json());

    return { data };
  } catch (error) {
    console.error(error);

    return { data: undefined };
  }
}

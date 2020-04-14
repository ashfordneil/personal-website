import {
  Resource,
  listFilesRaw,
  getFileMetadata,
  getFile
} from "utility/storage";

export interface StoryMetadata {
  etag: string;
  name: string;
  created: Date;
  tags: string[];
}

export interface Story extends StoryMetadata {
  body: string;
}

export const getStories = async (): Promise<StoryMetadata[]> => {
  const raw = await listFilesRaw("neilashford.dev", "stories/");
  if (!raw.items) {
    return [];
  }

  return raw.items
    .filter(item => item.name !== "stories/")
    .map(extractStoryMetadata);
};

export const getStory = async (story: string): Promise<Story> => {
  const metaPromise = getFileMetadata("neilashford.dev", `stories%2F${story}`);
  const dataPromise = getFile("neilashford.dev", `stories%2F${story}`);

  const [meta, body] = await Promise.all([metaPromise, dataPromise]);

  return { ...extractStoryMetadata(meta), body };
};

const extractStoryMetadata = (resource: Resource): StoryMetadata => {
  const path = resource.name.split("/");
  const [stories, name, ...end] = path;
  if (stories !== "stories" || end.length !== 0) {
    throw new Error("Resource path invalid");
  }

  const tagsRaw = resource.metadata["X-Neil-Tags"] || "";
  const tags = tagsRaw.split("|");

  return {
    etag: resource.etag,
    name,
    created: resource.timeCreated,
    tags
  };
};

import { Resource, listFilesRaw } from "utility/storage";

export interface Story {
  etag: string;
  name: string;
  updated: Date;
  tags: string[];
}

const extractStory = (resource: Resource): Story => {
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
    updated: resource.updated,
    tags
  };
};

export const getStories = async (): Promise<Story[]> => {
  const raw = await listFilesRaw("neilashford.com", "stories/");
  if (!raw.items) {
    return [];
  }

  return raw.items.filter(item => item.name !== "stories/").map(extractStory);
};

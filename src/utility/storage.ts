// RAW wrappers around GCP storage APIs

export interface ListFiles {
  kind: "storage#objects";
  nextPageToken?: string;
  items?: Resource[];
}

export interface Resource {
  kind: "storage#object";
  id: string;
  selfLink: string;
  name: string;
  bucket: string;
  generation: number;
  metageneration: number;
  contentType: string;
  timeCreated: Date;
  updated: Date;
  timeDeleted: Date;
  temporaryHold: boolean;
  eventBasedHold: boolean;
  retentionExpirationTime: Date;
  storageClass: string;
  timeStorageClassUpdated: Date;
  size: number;
  md5Hash: string;
  mediaLink: string;
  contentEncoding: string;
  contentDisposition: string;
  contentLanguage: string;
  cacheControl: string;
  metadata: {
    [key: string]: string;
  };
  owner: {
    entity: string;
    entityId: string;
  };
  crc32c: string;
  componentCount: number;
  etag: string;
  customerEncryption: {
    encryptionAlgorithm: string;
    keySha256: string;
  };
  kmsKeyName: string;
}

export const listFilesRaw = async (
  bucket: string,
  prefix: string,
  pageToken?: string
): Promise<ListFiles> => {
  const req = new URL(
    `https://storage.googleapis.com/storage/v1/b/${bucket}/o`
  );
  req.searchParams.append("prefix", prefix);
  if (pageToken) {
    req.searchParams.append("pageToken", pageToken);
  }

  const res = await fetch(req.toString(), { method: "GET" });
  const raw = await res.json();
  const items =
    raw.items &&
    raw.items.map((item: any) => ({
      ...item,
      timeCreated: new Date(item.timeCreated),
      updated: new Date(item.updated),
      timeDeleted: new Date(item.timeDeleted),
      retentionExpirationTime: new Date(item.retentionExpirationTime),
      timeStorageClassUpdated: new Date(item.timeStorageClassUpdated)
    }));

  return {
    ...raw,
    items
  };
};

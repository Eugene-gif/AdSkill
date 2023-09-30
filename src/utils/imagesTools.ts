export function getAvatar(id: string): string | undefined {
  const url =
    import.meta.env.VITE_API_URL + "/api/file/avatar/download/" + id;
  return url;
}

export function getAttachment(id: string): string | undefined {
  const url =
    import.meta.env.VITE_API_URL +
    "/api/file/attachment/download/" +
    id;
  return url;
}

export default {
  getAvatar,
  getAttachment,
};

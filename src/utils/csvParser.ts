interface BookmarkImport {
  url: string;
  title: string;
  description: string;
  folder?: string;
  tags: string[];
}

export function parseCSV(csvContent: string): BookmarkImport[] {
  const lines = csvContent.split('\n');
  const bookmarks: BookmarkImport[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      // Split by semicolon while respecting quotes
      const matches = line.match(/"([^"]*)"/g);
      if (!matches || matches.length !== 5) continue;

      const [url, title, description, folder, tags] = matches.map(m => m.slice(1, -1));

      if (!url || !title) continue;

      bookmarks.push({
        url,
        title,
        description,
        folder: folder || undefined,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
    } catch {
      continue;
    }
  }

  return bookmarks;
}
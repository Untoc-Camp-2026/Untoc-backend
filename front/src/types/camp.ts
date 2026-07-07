export interface CampProject {
  id: number;
  term: string;
  image_url?: string | null;
  team_name?: string | null;
  description?: string | null;
  content?: string | null;
  subject?: string | null;
  leader_name?: string | null;
  member_names?: string | null;
  display_order?: number | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MainProjectRow {
  id: number;
  teamName: string;
  projectName: string;
  subject: string;
  notionUrl: string | null;
}

export const mapCampProjectToRow = (project: CampProject): MainProjectRow => ({
  id: project.id,
  teamName: project.team_name || '-',
  projectName: project.description || '-',
  subject: project.subject || '-',
  notionUrl: project.content?.startsWith('http') ? project.content : null,
});

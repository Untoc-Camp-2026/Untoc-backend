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

export interface CampProjectCard {
  id: number;
  term: string;
  title: string;
  subtitle: string;
  imgUrl: string;
  topic: string;
  leader: string;
  members: string;
  description: string;
}

export const mapCampProjectToRow = (project: CampProject): MainProjectRow => ({
  id: project.id,
  teamName: project.team_name || '-',
  projectName: project.description || '-',
  subject: project.subject || '-',
  notionUrl: project.content?.startsWith('http') ? project.content : null,
});

export const mapCampProjectToCard = (project: CampProject): CampProjectCard => ({
  id: project.id,
  term: project.term,
  title: project.team_name || '팀',
  subtitle: project.description || '',
  imgUrl: project.image_url || '#EED270',
  topic: project.subject || '',
  leader: project.leader_name || '',
  members: project.member_names || '',
  description: project.content || '',
});

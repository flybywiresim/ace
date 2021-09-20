const LOCAL_STORAGE_KEY = 'recently_opened_projects';

export interface RecentlyOpenedProject {
    name: string,
    location: string,
}

export class RecentlyOpenedProjects {
    public static load(): RecentlyOpenedProject[] {
        let text = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (!text) {
            text = '[]';
        }

        return JSON.parse(text) as RecentlyOpenedProject[];
    }

    public static save(projects: RecentlyOpenedProject[]) {
        const text = JSON.stringify(projects);

        localStorage.setItem(LOCAL_STORAGE_KEY, text);
    }
}

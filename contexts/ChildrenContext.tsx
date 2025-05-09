import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Child, ChildSummary, ChildPerformance } from "@/types/child";
import { Activity } from "@/types/activity";
import { CHILDREN_DATA } from "@/data/Enfants/CHILDREN_DATA";

interface ChildrenContextType {
  children: Child[];
  loading: boolean;
  error: string | null;
  getChild: (id: number) => Child | undefined;
  getChildSummary: (id: number) => ChildSummary | undefined;
  getChildPerformance: (id: number) => ChildPerformance | undefined;
  addChild: (child: Omit<Child, "id">) => void;
  updateChild: (id: number, updates: Partial<Child>) => void;
  deleteChild: (id: number) => void;
  refreshChildren: () => Promise<void>;
}

const ChildrenContext = createContext<ChildrenContextType | undefined>(
  undefined
);

interface ChildrenProviderProps {
  children: ReactNode;
  initialData?: Child[];
}

export const ChildrenProvider: React.FC<ChildrenProviderProps> = ({
  children: childrenElement,
  initialData,
}) => {
  const [children, setChildren] = useState<Child[]>(initialData || []);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Convert mock data to match the expected Child type
  const processChildData = (data: typeof CHILDREN_DATA): Child[] => {
    return data.map((child) => ({
      ...child,
      // Add childId to each activity
      activitesRecentes: child.activitesRecentes.map((activity) => ({
        ...activity,
        childId: child.id,
      })) as Activity[],
    }));
  };

  // Fetch children data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from an API
        // For now, use mock data with a delay to simulate network request
        setTimeout(() => {
          // Process the data to add childId to each activity
          const processedData = processChildData(CHILDREN_DATA);
          setChildren(processedData);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to fetch children data");
        setLoading(false);
      }
    };

    if (!initialData) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [initialData]);

  // Get a specific child by ID
  const getChild = (id: number) => {
    return children.find((child) => child.id === id);
  };

  // Get summary data for a child
  const getChildSummary = (id: number): ChildSummary | undefined => {
    const child = getChild(id);
    if (!child) return undefined;

    // Calculate summary data
    const totalActivities = child.activitesRecentes.length;

    // Calculate total duration (mock implementation)
    let totalMinutes = 0;
    child.activitesRecentes.forEach((activity) => {
      const duration = activity.duree;
      const match = duration.match(/(\d+)/);
      if (match) {
        totalMinutes += parseInt(match[0], 10);
      }
    });
    const totalDuration = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}min`;

    // Get last activity date
    const lastActivityDate =
      child.activitesRecentes.length > 0
        ? child.activitesRecentes.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0].date
        : new Date().toISOString();

    // Get favorite subject (mock implementation)
    const subjects = new Map<string, number>();
    child.activitesRecentes.forEach((activity) => {
      if (activity.matiere) {
        subjects.set(
          activity.matiere,
          (subjects.get(activity.matiere) || 0) + 1
        );
      }
    });

    let favoriteSubject: string | undefined;
    let maxCount = 0;
    subjects.forEach((count, subject) => {
      if (count > maxCount) {
        maxCount = count;
        favoriteSubject = subject;
      }
    });

    return {
      totalActivities,
      totalDuration,
      lastActivityDate,
      favoriteSubject,
      progress: child.progress,
      evolutionRate: 5, // Mock evolution rate
    };
  };

  // Get performance data for a child
  const getChildPerformance = (id: number): ChildPerformance | undefined => {
    const child = getChild(id);
    if (!child) return undefined;

    // Calculate subject performance (mock implementation)
    const subjectPerformance = [
      ...child.matieresFortes,
      ...child.matieresAmeliorer.map((s) => s.replace(/^\?/, "").trim()),
    ].map((subject) => ({
      name: subject,
      progress:
        subject === child.matieresFortes[0]
          ? 80 + Math.floor(Math.random() * 15)
          : child.matieresFortes.includes(subject)
            ? 70 + Math.floor(Math.random() * 15)
            : 40 + Math.floor(Math.random() * 25),
      evolution: Math.floor(Math.random() * 20) - 5,
    }));

    return {
      overall: child.progress,
      evolution: 5, // Mock evolution
      bySubject: subjectPerformance,
    };
  };

  // Add a new child
  const addChild = (child: Omit<Child, "id">) => {
    const newId = Math.max(...children.map((c) => c.id), 0) + 1;
    const newChild = {
      ...child,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Child;

    setChildren((prevChildren) => [...prevChildren, newChild]);
  };

  // Update a child
  const updateChild = (id: number, updates: Partial<Child>) => {
    setChildren((prevChildren) =>
      prevChildren.map((child) =>
        child.id === id
          ? { ...child, ...updates, updatedAt: new Date().toISOString() }
          : child
      )
    );
  };

  // Delete a child
  const deleteChild = (id: number) => {
    setChildren((prevChildren) =>
      prevChildren.filter((child) => child.id !== id)
    );
  };

  // Refresh children data
  const refreshChildren = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch from an API
      // For now, use mock data with a delay to simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Process the data to add childId to each activity
      const processedData = processChildData(CHILDREN_DATA);
      setChildren(processedData);

      setLoading(false);
    } catch (err) {
      setError("Failed to refresh children data");
      setLoading(false);
    }
  };

  const value = {
    children,
    loading,
    error,
    getChild,
    getChildSummary,
    getChildPerformance,
    addChild,
    updateChild,
    deleteChild,
    refreshChildren,
  };

  return (
    <ChildrenContext.Provider value={value}>
      {childrenElement}
    </ChildrenContext.Provider>
  );
};

export const useChildren = () => {
  const context = useContext(ChildrenContext);
  if (context === undefined) {
    throw new Error("useChildren must be used within a ChildrenProvider");
  }
  return context;
};

export default ChildrenContext;

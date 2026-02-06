import styles from "./page.module.css";

interface User {
  name: string;
  age: number;
}

interface ApiResponse {
  message: string;
  timestamp: string;
  data: User[];
}

export default async function Home() {
  let apiData: ApiResponse | null = null;
  const apiUrl = process.env.API_URL || "http://localhost:4000";
  try {
    const response = await fetch(`${apiUrl}/data`, {
      next: { revalidate: 10 },
    });
    apiData = (await response.json()) as ApiResponse;
  } catch (error) {
    console.error("Failed to fetch data from API:", error);
  }

  return (
    <div className={styles.page}>
      {apiData ? (
        <div className={styles.apiContent}>
          <h2>Fetching Data from NestJS API</h2>
          <p>{apiData.message}</p>
          <p>Fetched at: {apiData.timestamp}</p>
          <div className={styles.grid}>
            {apiData.data?.map((user: User, index: number) => (
              <div key={index} className={styles.card}>
                <h3>{user.name}</h3>
                <p>Age: {user.age}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.error}>Could not connect to the API 😢</p>
      )}
    </div>
  );
}

/* Re-mounts on every navigation, giving each page a quick enter transition
   (replaces the old 1.3s full-screen wipe that blocked every click). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}

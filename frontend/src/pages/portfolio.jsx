export default function Portfolio() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Projects</h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <li className="p-4 bg-white shadow rounded">Project 1</li>
        <li className="p-4 bg-white shadow rounded">Project 2</li>
        <li className="p-4 bg-white shadow rounded">Project 3</li>
      </ul>
    </div>
  );
}

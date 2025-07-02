import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeContent from "../components/HomeContent";


export default function Home({ user, onLogout }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}!</h1>
      <button
        onClick={onLogout}
        className="mb-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <a href="/account" className="text-green-600 underline">
        Go to your account
      </a>
    </div>
  );
}


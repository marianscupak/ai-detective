import ProfileLink from "./profile-link";

const Header = () => {
  return (
    <div className="flex px-6 py-2 h-16 bg-white items-center justify-end">
      <ProfileLink />
    </div>
  );
};

export default Header;

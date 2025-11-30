import ProfileLink from './profile-link';

const Header = () => {
	return (
		<div className="flex h-16 items-center justify-end bg-white px-6 py-2">
			<ProfileLink />
		</div>
	);
};

export default Header;

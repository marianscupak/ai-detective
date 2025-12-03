const InvestigationsLoader = () => {
	return (
		<ul className="flex flex-col gap-2">
			{Array.from({ length: 7 }).map((_, i) => (
				<li
					key={i}
					className="block h-24 w-full animate-pulse rounded-lg bg-linear-to-r from-gray-100 to-gray-200 lg:h-20"
				/>
			))}
		</ul>
	);
};

export default InvestigationsLoader;

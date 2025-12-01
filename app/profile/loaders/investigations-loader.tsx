const InvestigationsLoader = () => {
	return (
		<ul className="flex flex-col gap-2">
			{Array.from({ length: 3 }).map((_, i) => (
				<li key={i} className="h-12 rounded-lg bg-gray-300" />
			))}
		</ul>
	);
};

export default InvestigationsLoader;

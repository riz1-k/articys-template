interface AuthFieldErrorProps {
	errors: Array<{ message?: string } | undefined>;
}

export default function AuthFieldError({ errors }: AuthFieldErrorProps) {
	if (!errors.length) {
		return null;
	}

	return (
		<>
			{errors.map((error) => (
				<p key={error?.message} className="text-destructive text-xs">
					{error?.message}
				</p>
			))}
		</>
	);
}

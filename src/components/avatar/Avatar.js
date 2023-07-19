import PropTypes from 'prop-types';

export const Avatar = ({ avatarSrc, name, bgColor='#f33e58', textColor, size, round=true }) => {
	const textSizeRatio = 2;
	const fontSize = Math.floor(size / textSizeRatio);

	return (
		<>
			{ !avatarSrc && (
				<div
					data-testid="avatar-container"
					className="avatar-container"
					style={{ width: `${size}px`, height: `${size}px`, borderRadius: `${round ? 50 : 0}%`, backgroundColor: `${!avatarSrc ? bgColor : ''}`, display: 'flex' }}
				>
					{name && (
						<div
							data-testid="avatar-container"
							style={{ color: `${textColor}`, fontSize: `${fontSize}px`, margin: 'auto', fontWeight: 'bold', textTransform: 'uppercase' }}
						>
							{name?.charAt(0)}
						</div>
					)}
				</div>
			) }
			{ avatarSrc && (
				<img
					src={avatarSrc}
					alt="Avatar"
					className="avatar-content avatar-container"
					style={{ width: `${size}px`, height: `${size}px`, borderRadius: `${round ? 50 : 0}%` }}
				/>
			)}
		</>
	);
}

Avatar.propTypes = {
	avatarSrc: PropTypes.string,
	name: PropTypes.string,
	bgColor: PropTypes.string,
	textColor: PropTypes.string,
	size: PropTypes.number,
	round: PropTypes.bool
};

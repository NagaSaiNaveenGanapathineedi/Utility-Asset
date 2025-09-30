import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 40, color = 'var(--color-light-primary)' }) => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: '40px',
			color: 'var(--color-text-medium)'
		}}
	>
		<motion.div
			animate={{ rotate: 360 }}
			transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
			style={{
				width: size,
				height: size,
				border: `3px solid var(--color-border-light)`,
				borderTop: `3px solid ${color}`,
				borderRadius: '50%'
			}}
		/>
	</motion.div>
);

export default LoadingSpinner;
import css from './ErrorMessage.module.css';
interface ErrorMessageProps {
    message?: string;
}
const ErrorMessage = ({ message = 'Something went wrong!' }: ErrorMessageProps) => (
    <div className={css.error}>{message}</div>
);
export default ErrorMessage;
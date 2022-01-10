import { useAuthenticationContext } from 'contexts/authentication';

export default () => {
  const { login } = useAuthenticationContext();

  const onSubmit = event => {
    event.preventDefault();
    event.stopPropagation();
    login("token");
  };

  return (
    <div onClick={onSubmit}>
      Login!
    </div>
  );
};

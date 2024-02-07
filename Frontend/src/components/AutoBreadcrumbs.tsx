import { useMatches } from 'react-router-dom';
import { Breadcrumb } from 'antd';

export const AutoBreadcrumbs = () => {
  const matches = useMatches();
  const crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    .filter((match) => typeof (match.handle?.crumb) === 'function')
    // now map them into an array of elements, passing the loader
    // data to each one
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    .map((match) => match.handle.crumb(match.data));

  return (
    <Breadcrumb items={crumbs.map((crumb) => ({ title: crumb }))} />
  );
};
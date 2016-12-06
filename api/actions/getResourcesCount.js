import Resource from '../models/resource';

export default function getResourcesCount() {
  return Resource.count();
}

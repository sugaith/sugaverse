import { create } from 'zustand'
import {Api} from '@react-three/cannon'
import {Object3D} from "three";

export interface SphereApi extends Api<Object3D> {
  mass: number;
}
interface SphereStore {
  apis: SphereApi[];
  register: (api: SphereApi) => void;
  unregister: (api: SphereApi) => void;
}

const useStore = create<SphereStore>(set => ({
  apis: [],
  register: api => set(state => ({ apis: [...state.apis, api] })),
  unregister: api => set(state => ({ apis: state.apis.filter(a => a !== api) }))
}))

export default useStore;

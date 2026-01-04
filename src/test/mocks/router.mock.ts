import { reactive } from 'vue'

export interface RouteMock {
  params: Record<string, string>
  query: Record<string, string>
  path: string
}

export const routeMock = reactive<RouteMock>({
  params: {id: '1'},
  query: {},
  path: '/',
})

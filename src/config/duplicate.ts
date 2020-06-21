import {CREATE_SCENE, GET_SCENES, CREATE_CAST, GET_CASTS, CREATE_LIGHT, GET_LIGHTS, UPDATE_SCENE_ORDER} from './graph'

export async function createScene(scenarioId: string, order: number, name: string, music: string) {
  this.loading = true
  this.error = undefined
  try {
    const {
      data: {createScene},
    } = await this.$apollo.mutate({
      mutation: CREATE_SCENE,
      variables: {
        name,
        scenarioId,
        music,
        order,
      },
      update(proxy, {data: {createScene}}) {
        const query = {
          query: GET_SCENES,
          variables: {
            scenario: createScene.scenario.id,
          },
        }
        const data = proxy.readQuery(query)
        data.allScenes.push(createScene)
        data.allScenes.sort((a, b) => a.order - b.order)
        proxy.writeQuery({...query, data})
      },
    })
    this.loading = false
    return createScene
  } catch (error) {
    this.error = error
  }
}

export async function updateSceneOrder(id: string, order: number) {
  this.loading = true
  this.error = undefined
  try {
    const {
      data: {updateScene},
    } = await this.$apollo.mutate({
      mutation: UPDATE_SCENE_ORDER,
      variables: {
        id,
        order,
      },
      update(proxy, {data: {updateScene}}) {
        const query = {
          query: GET_SCENES,
          variables: {
            scenario: updateScene.scenario.id,
          },
        }
        const data = proxy.readQuery(query)
        const sceneIndex = data.allScenes.findIndex(s => s.id === id)
        data.allScenes[sceneIndex] = updateScene
        data.allScenes.sort((a, b) => a.order - b.order)
        proxy.writeQuery({...query, data})
      },
    })
    this.loading = false
    return updateScene
  } catch (error) {
    this.error = error
  }
}

export async function createCast(sceneId: string, deviceId: string, media: string) {
  this.loading = true
  this.error = undefined
  try {
    const {
      data: {createCast},
    } = await this.$apollo.mutate({
      mutation: CREATE_CAST,
      variables: {deviceId, media, sceneId},
      update(proxy, {data: {createCast}}) {
        const query = {
          query: GET_CASTS,
          variables: {
            sceneId: createCast.scene.id,
          },
        }
        const data = proxy.readQuery(query)
        data.allCasts.push(createCast)
        proxy.writeQuery({...query, data})
      },
    })
    this.loading = false
    return createCast
  } catch (error) {
    this.error = error
  }
}

export async function createLight(sceneId: string, deviceId: string, power: string, bright: number, color: string) {
  this.loading = true
  this.error = undefined
  try {
    const {
      data: {createLight},
    } = await this.$apollo.mutate({
      mutation: CREATE_LIGHT,
      variables: {sceneId, deviceId, power, bright, color},
      update(proxy, {data: {createLight}}) {
        const query = {
          query: GET_LIGHTS,
          variables: {
            sceneId: createLight.scene.id,
          },
        }
        const data = proxy.readQuery(query)
        data.allLights.push(createLight)
        proxy.writeQuery({...query, data})
      },
    })
    this.loading = false
    return createLight
  } catch (error) {
    this.error = error
  }
}

export async function duplicateScene(scene) {
  const {id: sceneId} = await createScene.bind(this)(scene.scenario.id, scene.order, scene.name, scene.music)
  // Lights
  const {
    data: {allLights},
  } = await this.$apollo.query({
    query: GET_LIGHTS,
    variables: {
      sceneId: scene.id,
    },
  })
  for await (const light of allLights)
    createLight.bind(this)(sceneId, light.deviceId, light.power, light.bright, light.color)
  // Casts
  const {
    data: {allCasts},
  } = await this.$apollo.query({
    query: GET_CASTS,
    variables: {
      sceneId: scene.id,
    },
  })
  for await (const cast of allCasts) createCast.bind(this)(sceneId, cast.deviceId, cast.media)
}

export async function importScene(scene, scenarioId) {
  const {id: sceneId} = await createScene.bind(this)(scenarioId, scene.order, scene.name, scene.music)
  for await (const light of scene.lights)
    createLight.bind(this)(sceneId, light.deviceId, light.power, light.bright, light.color)
  for await (const cast of scene.casts) createCast.bind(this)(sceneId, cast.deviceId, cast.media)
}

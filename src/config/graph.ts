import gql from 'graphql-tag'

// https://console.graph.cool/

/*
 * SCENARIO
 */
export const ALL_SCENARIOS = gql`
  query {
    allScenarios: Scenario(order_by: {name: asc}) {
      id
      name
    }
  }
`

export const GET_SCENARIO = gql`
  query($id: Int!) {
    Scenario: Scenario_by_pk(id: $id) {
      id
      name
      scenes: ScenarioScenes(order_by: {order: asc}) {
        id
        scenario: SceneScenario {
          id
        }
      }
    }
  }
`

export const FULL_SCENARIO = gql`
  query($id: Int!) {
    Scenario: Scenario_by_pk(id: $id) {
      id
      name
      scenes: ScenarioScenes(order_by: {order: asc}) {
        name
        music
        order
        lights: SceneLights {
          deviceId
          power
          bright
          color
        }
        casts: SceneCasts {
          deviceId
          media
        }
      }
    }
  }
`

export const CREATE_SCENARIO = gql`
  mutation($name: String!) {
    createScenario: insert_Scenario_one(object: {name: $name}) {
      id
      name
    }
  }
`

export const UPDATE_SCENARIO = gql`
  mutation($id: Int!, $name: String!) {
    updateScenario: update_Scenario_by_pk(pk_columns: {id: $id}, _set: {name: $name}) {
      id
      name
    }
  }
`

export const DELETE_SCENARIO = gql`
  mutation($id: Int!) {
    deleteScenario: delete_Scenario_by_pk(id: $id) {
      id
    }
  }
`

/*
 * SCENE
 */
export const GET_SCENES = gql`
  query($scenario: Int!) {
    allScenes: Scene(where: {scenario: {_eq: $scenario}}, order_by: {order: asc}) {
      id
      name
      order
      music
      scenario: SceneScenario {
        id
      }
    }
  }
`

export const CREATE_SCENE = gql`
  mutation($name: String!, $scenarioId: Int!, $order: Int, $music: String) {
    createScene: insert_Scene_one(object: {name: $name, scenario: $scenarioId, order: $order, music: $music}) {
      id
      name
      order
      music
      scenario: SceneScenario {
        id
      }
    }
  }
`

export const UPDATE_SCENE = gql`
  mutation($id: Int!, $name: String!, $music: String, $order: Int) {
    updateScene: update_Scene_by_pk(pk_columns: {id: $id}, _set: {name: $name, music: $music, order: $order}) {
      id
      name
      order
      music
      scenario: SceneScenario {
        id
      }
    }
  }
`

export const UPDATE_SCENE_ORDER = gql`
  mutation($id: Int!, $order: Int) {
    updateScene: update_Scene_by_pk(pk_columns: {id: $id}, _set: {order: $order}) {
      id
      name
      order
      music
      scenario: SceneScenario {
        id
      }
    }
  }
`

export const SCENE_COMPLETE = gql`
  query($id: Int!) {
    Scene(id: $id) {
      name
      music
      order
      lights: SceneLights(order_by: {deviceId: asc}) {
        deviceId
        power
        bright
        color
      }
      casts: SceneCasts(order_by: {deviceId: asc}) {
        deviceId
        media
      }
    }
  }
`

export const DELETE_SCENE = gql`
  mutation($id: Int!) {
    deleteScene: delete_Scene_by_pk(id: $id) {
      id
    }
  }
`

/*
 * LIGHT
 */
export const GET_LIGHTS = gql`
  query($sceneId: Int!) {
    allLights: Light(where: {scene: {_eq: $sceneId}}, order_by: {deviceId: asc}) {
      id
      deviceId
      power
      bright
      color
      scene: LightScene {
        id
      }
    }
  }
`

export const CREATE_LIGHT = gql`
  mutation($deviceId: String, $power: String, $bright: Int, $color: String, $sceneId: Int!) {
    createLight: insert_Light_one(
      object: {deviceId: $deviceId, power: $power, color: $color, bright: $bright, scene: $sceneId}
    ) {
      id
      deviceId
      power
      bright
      color
      scene: LightScene {
        id
      }
    }
  }
`

export const UPDATE_LIGHT = gql`
  mutation($id: Int!, $power: String, $bright: Int, $color: String) {
    updateLight: update_Light_by_pk(pk_columns: {id: $id}, _set: {power: $power, bright: $bright, color: $color}) {
      id
      deviceId
      power
      bright
      color
      scene: LightScene {
        id
      }
    }
  }
`

export const DELETE_LIGHT = gql`
  mutation($id: Int!) {
    deleteLight: delete_Light_by_pk(id: $id) {
      id
    }
  }
`

/*
 * DASHBOARD (=ALL)
 */
export const ALL_DASHBOARD = gql`
  query {
    allScenarios: Scenario(order_by: {name: asc}) {
      id
      name
      scenes: ScenarioScenes(order_by: {order: asc}) {
        id
        name
        music
        order
        lights: SceneLights {
          deviceId
          power
          bright
          color
        }
        casts: SceneCasts {
          deviceId
          media
        }
      }
    }
  }
`

/*
 * CASTS
 */
export const GET_CASTS = gql`
  query($sceneId: Int!) {
    allCasts: Cast(where: {scene: {_eq: $sceneId}}, order_by: {deviceId: asc}) {
      id
      deviceId
      media
      scene: CastScene {
        id
      }
    }
  }
`

export const CREATE_CAST = gql`
  mutation($deviceId: String, $media: String, $sceneId: Int!) {
    createCast: insert_Cast_one(object: {deviceId: $deviceId, media: $media, scene: $sceneId}) {
      id
      deviceId
      media
      scene: CastScene {
        id
      }
    }
  }
`

export const UPDATE_CAST = gql`
  mutation($id: Int!, $media: String) {
    updateCast: update_Cast_by_pk(pk_columns: {id: $id}, _set: {media: $media}) {
      id
      deviceId
      media
      scene: CastScene {
        id
      }
    }
  }
`

export const DELETE_CAST = gql`
  mutation($id: Int!) {
    deleteCast: delete_Cast_by_pk(id: $id) {
      id
    }
  }
`

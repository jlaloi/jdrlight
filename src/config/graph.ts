import gql from 'graphql-tag'

// https://console.graph.cool/

/*
 * SCENARIO
 */
export const ALL_SCENARIOS = gql`
  query {
    allScenarios(orderBy: name_ASC) {
      id
      name
    }
  }
`

export const GET_SCENARIO = gql`
  query($id: ID!) {
    Scenario(id: $id) {
      id
      name
      scenes {
        id
        scenario {
          id
        }
      }
    }
  }
`

export const FULL_SCENARIO = gql`
  query($id: ID!) {
    Scenario(id: $id) {
      id
      name
      scenes(orderBy: order_ASC) {
        name
        music
        order
        lights {
          deviceId
          power
          bright
          rgb
        }
        casts {
          deviceId
          media
        }
      }
    }
  }
`

export const CREATE_SCENARIO = gql`
  mutation($name: String!) {
    createScenario(name: $name) {
      id
      name
    }
  }
`

export const UPDATE_SCENARIO = gql`
  mutation($id: ID!, $name: String!) {
    updateScenario(id: $id, name: $name) {
      id
      name
    }
  }
`

export const DELETE_SCENARIO = gql`
  mutation($id: ID!) {
    deleteScenario(id: $id) {
      id
    }
  }
`

/*
 * SCENE
 */
export const GET_SCENES = gql`
  query($scenario: ID!) {
    allScenes(filter: {scenario: {id: $scenario}}, orderBy: order_ASC) {
      id
      name
      order
      music
      scenario {
        id
      }
    }
  }
`

export const CREATE_SCENE = gql`
  mutation($name: String!, $scenarioId: ID!, $order: Int, $music: String) {
    createScene(name: $name, scenarioId: $scenarioId, order: $order, music: $music) {
      id
      name
      order
      music
      scenario {
        id
      }
    }
  }
`

export const UPDATE_SCENE = gql`
  mutation($id: ID!, $name: String!, $music: String, $order: Int) {
    updateScene(id: $id, name: $name, music: $music, order: $order) {
      id
      name
      order
      music
      scenario {
        id
      }
    }
  }
`

export const UPDATE_SCENE_ORDER = gql`
  mutation($id: ID!, $order: Int) {
    updateScene(id: $id, order: $order) {
      id
      name
      order
      music
      scenario {
        id
      }
    }
  }
`

export const SCENE_COMPLETE = gql`
  query($id: ID!) {
    Scene(id: $id) {
      name
      music
      order
      lights(orderBy: deviceId_ASC) {
        deviceId
        power
        bright
        rgb
      }
      casts(orderBy: deviceId_ASC) {
        deviceId
        media
      }
    }
  }
`

export const DELETE_SCENE = gql`
  mutation($id: ID!) {
    deleteScene(id: $id) {
      id
    }
  }
`

/*
 * LIGHT
 */
export const GET_LIGHTS = gql`
  query($sceneId: ID!) {
    allLights(filter: {scene: {id: $sceneId}}, orderBy: deviceId_ASC) {
      id
      deviceId
      power
      bright
      rgb
      scene {
        id
      }
    }
  }
`

export const CREATE_LIGHT = gql`
  mutation($deviceId: String, $power: String, $bright: Int, $rgb: [Int!]!, $sceneId: ID!) {
    createLight(deviceId: $deviceId, power: $power, bright: $bright, rgb: $rgb, sceneId: $sceneId) {
      id
      deviceId
      power
      bright
      rgb
      scene {
        id
      }
    }
  }
`

export const UPDATE_LIGHT = gql`
  mutation($id: ID!, $power: String, $bright: Int, $rgb: [Int!]!) {
    updateLight(id: $id, power: $power, bright: $bright, rgb: $rgb) {
      id
      deviceId
      power
      bright
      rgb
      scene {
        id
      }
    }
  }
`

export const DELETE_LIGHT = gql`
  mutation($id: ID!) {
    deleteLight(id: $id) {
      id
    }
  }
`

/*
 * DASHBOARD (=ALL)
 */
export const ALL_DASHBOARD = gql`
  query {
    allScenarios(orderBy: name_ASC) {
      id
      name
      scenes(orderBy: order_ASC) {
        name
        music
        order
        lights {
          deviceId
          power
          bright
          rgb
        }
        casts {
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
  query($sceneId: ID!) {
    allCasts(filter: {scene: {id: $sceneId}}, orderBy: deviceId_ASC) {
      id
      deviceId
      media
      scene {
        id
      }
    }
  }
`

export const CREATE_CAST = gql`
  mutation($deviceId: String, $media: String, $sceneId: ID!) {
    createCast(deviceId: $deviceId, media: $media, sceneId: $sceneId) {
      id
      deviceId
      media
      scene {
        id
      }
    }
  }
`

export const UPDATE_CAST = gql`
  mutation($id: ID!, $media: String) {
    updateCast(id: $id, media: $media) {
      id
      deviceId
      media
      scene {
        id
      }
    }
  }
`

export const DELETE_CAST = gql`
  mutation($id: ID!) {
    deleteCast(id: $id) {
      id
    }
  }
`

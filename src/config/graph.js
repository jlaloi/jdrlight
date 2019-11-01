import gql from 'graphql-tag'

// https://console.graph.cool/

/*
 * SCENARIO
 */
export const ALL_SCENARIOS = gql`
  query {
    allScenarios {
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
    allScenes(filter: {scenario: {id: $scenario}}) {
      id
      name
      music
      scenario {
        id
      }
    }
  }
`

export const CREATE_SCENE = gql`
  mutation($name: String!, $scenarioId: ID!) {
    createScene(name: $name, scenarioId: $scenarioId) {
      id
      name
      music
      scenario {
        id
      }
    }
  }
`

export const UPDATE_SCENE = gql`
  mutation($id: ID!, $name: String!, $music: String) {
    updateScene(id: $id, name: $name, music: $music) {
      id
      name
      music
      scenario {
        id
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
    allLights(filter: {scene: {id: $sceneId}}) {
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
    allScenarios {
      id
      name
      scenes {
        name
        music
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
 * LIGHT
 */
export const GET_CASTS = gql`
  query($sceneId: ID!) {
    allCasts(filter: {scene: {id: $sceneId}}) {
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

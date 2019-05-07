import gql from 'graphql-tag';

// https://console.graph.cool/

export const ALL_SCENES = gql`
  query {
    allScenes {
      id
      name
      music
      lights {
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
  }
`;

export const CREATE_SCENE = gql`
  mutation($name: String!) {
    createScene(name: $name) {
      id
      name
      music
      lights {
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
  }
`;

export const CREATE_LIGHT = gql`
  mutation(
    $deviceId: String
    $power: String
    $bright: Int
    $rgb: [Int!]!
    $sceneId: ID!
  ) {
    createLight(
      deviceId: $deviceId
      power: $power
      bright: $bright
      rgb: $rgb
      sceneId: $sceneId
    ) {
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
`;

export const DELETE_SCENE = gql`
  mutation($id: ID!) {
    deleteScene(id: $id) {
      id
    }
  }
`;

export const DELETE_LIGHT = gql`
  mutation($id: ID!) {
    deleteLight(id: $id) {
      id
    }
  }
`;

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
`;

export const UPDATE_SCENE = gql`
  mutation($id: ID!, $name: String!, $music: String) {
    updateScene(id: $id, name: $name, music: $music) {
      id
      name
      music
      lights {
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
  }
`;

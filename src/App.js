import React, { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  Linking,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);
    const likedRepository = response.data;

    const repositoryUpdate = repositories.map(repository => {
      return repository.id === id
        ? likedRepository
        : repository;
    });

    setRepositories(repositoryUpdate);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.repository}>
                  {repository.title}
                </Text>

                <View style={styles.likeContainer}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => handleLikeRepository(repository.id)}
                    testID={`like-button-${repository.id}`}
                  >
                    <Icon name="favorite" size={30} color="#CCC" />
                  </TouchableOpacity>

                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${repository.id}`}
                  >
                    {repository.likes}
                  </Text>
                </View>
             </View>

              <Text style={styles.description}>
                {repository.description}
              </Text>

              <TouchableOpacity
                onPress={() => Linking.openURL(repository.url)}>
                <Text style={styles.url}>
                  {repository.url}
                </Text>
              </TouchableOpacity>

              <FlatList
                style={styles.techsContainer}
                data={repository.techs}
                keyExtractor={tech => tech}
                renderItem={({ item: tech }) => (
                  <Text style={styles.tech}>
                    {tech}
                  </Text>
                )}
              />
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A934F0",
  },
  repositoryContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 6,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  repository: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  url: {
    marginTop: 20,
    color: "#0085FF",
    fontSize: 12,
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  tech: {
    fontSize: 14,
    fontWeight: "200",
    marginTop: 10,
    marginRight: 7,
    paddingHorizontal: 10,
    color: "#ff0000",
    borderRadius: 10,
    borderColor: '#ff0000',
    borderWidth: 0.5,
  },
  likeContainer: {
    marginTop: 10,
    flexDirection: "row-reverse",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ccc",
    marginTop: 5,
    marginRight: 5,
  },
});

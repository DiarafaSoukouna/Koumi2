import { router } from 'expo-router'
import { useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native'

const { width } = Dimensions.get('window')

interface Slide {
  id: number
  image: any
  title: string
  subtitle: string
  color: string
}

interface ScrollingPageProps {
  onComplete?: () => void
}

const slides: Slide[] = [
  {
    id: 1,
    image: require('@/assets/images/poissons.jpg'),
    title: 'Bienvenue sur Koumi',
    subtitle: "Explorez l'univers des produits locaux autour de vous.",
    color: '#4CAF50',
  },
  {
    id: 2,
    image: require('@/assets/images/localisation.png'),
    title: 'Trouvez facilement',
    subtitle: 'Recherchez des producteurs et magasins près de votre position.',
    color: '#2196F3',
  },
  {
    id: 3,
    image: require('@/assets/images/magasin.jpg'),
    title: 'Rejoignez la communauté',
    subtitle:
      'Achetez, partagez et découvrez les meilleures offres près de chez vous.',
    color: '#FF9800',
  },
]

export default function ScrollingPage({ onComplete }: ScrollingPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const slidesRef = useRef<FlatList<Slide>>(null)

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) {
        setCurrentIndex(viewableItems[0].index ?? 0)
      }
    }
  ).current

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 })
    } else {
      onComplete?.()
    }
  }
  const redirect = () => {
    router.replace('/login')
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <FlatList
        ref={slidesRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        renderItem={({ item }) => (
          <View
            style={{ width, flex: 1, paddingTop: 60, paddingHorizontal: 24 }}
          >
            {/* Image avec bordure colorée */}
            <View
              style={{
                width: '100%',
                height: 380,
                borderRadius: 32,
                overflow: 'hidden',
                borderWidth: 4,
                borderColor: item.color,
                backgroundColor: 'white',
                shadowColor: item.color,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <Image
                source={item.image}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>

            {/* Texte */}
            <View style={{ marginTop: 48, paddingHorizontal: 8 }}>
              <Text
                style={{
                  color: '#1F2937',
                  fontSize: 32,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 16,
                  letterSpacing: -0.5,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 17,
                  textAlign: 'center',
                  lineHeight: 26,
                }}
              >
                {item.subtitle}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Footer avec dots et bouton */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 48,
          paddingTop: 24,
          backgroundColor: '#FAFAFA',
        }}
      >
        {/* Pagination Dots */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          {slides.map((slide, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ]

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            })

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.25, 1, 0.25],
              extrapolate: 'clamp',
            })

            return (
              <Animated.View
                key={index}
                style={{
                  width: dotWidth,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: slide.color,
                  marginHorizontal: 4,
                  opacity,
                }}
              />
            )
          })}
        </View>

        {/* Bouton */}
        <TouchableOpacity
          onPress={currentIndex === slides.length - 1 ? redirect : scrollTo}
          style={{
            width: '100%',
            backgroundColor: slides[currentIndex].color,
            paddingVertical: 18,
            borderRadius: 16,
            shadowColor: slides[currentIndex].color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 6,
          }}
          activeOpacity={0.85}
        >
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 17,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            {currentIndex === slides.length - 1 ? 'Commencer 🎉' : 'Suivant →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

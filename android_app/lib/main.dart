import 'package:flutter/material.dart';
import 'package:my_virtual_pet_android/pages/home_page.dart';
import 'package:spine_flutter/spine_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initSpineFlutter(enableMemoryDebugging: false);

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Petmety',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrangeAccent),
        useMaterial3: true,
      ),
      home: HomePage(),
    );
  }
}

// overlay entry point
@pragma("vm:entry-point")
void overlayMain() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initSpineFlutter(enableMemoryDebugging: false);

  final controller = SpineWidgetController(onInitialized: (controller) {
    controller.animationState.setAnimationByName(0, "Idle", true);
  });
  runApp(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Material(
        color: Colors.transparent,
        elevation: 0.0,
        child: GestureDetector(
          onTap: () async {},
          child: SizedBox(
            width: 200,
            height: 500,
            child: SpineWidget.fromAsset(
              "assets/cat.atlas",
              "assets/cat.json",
              controller,
            ),
          ),
        ),
      ),
    ),
  );
}

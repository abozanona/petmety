import 'package:flutter/material.dart';
import 'package:flutter_overlay_window/flutter_overlay_window.dart';
import 'package:spine_flutter/spine_widget.dart';

class HomePage extends StatefulWidget {
  final controller = SpineWidgetController(onInitialized: (controller) {
    controller.animationState.setAnimationByName(0, "Idle", true);
  });

  HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Virtual Pet')),
      body: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            width: 200,
            child: SpineWidget.fromAsset(
              "assets/cat.atlas",
              "assets/cat.json",
              widget.controller,
            ),
          ),
          TextButton(
            onPressed: () async {
              final bool status =
                  await FlutterOverlayWindow.isPermissionGranted();
              if (!status) {
                /// request overlay permission
                /// it will open the overlay settings page and return `true` once the permission granted.
                final bool? status =
                    await FlutterOverlayWindow.requestPermission();
                    if(status != null && status) {
                      // Do something, right?
                    }
              }

              await FlutterOverlayWindow.showOverlay(
                height: 500,
                width: 800,
                visibility: NotificationVisibility.visibilityPublic,
                flag: OverlayFlag.defaultFlag,
                enableDrag: true,
              );
            },
            child: const Text("Open"),
          ),
          TextButton(
            onPressed: () async {
              await FlutterOverlayWindow.closeOverlay();
            },
            child: const Text("Close"),
          )
        ],
      ),
    );
  }
}

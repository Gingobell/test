figma.showUI(`
  <html>
    <body style="margin:0;padding:12px;font-family:sans-serif;">
      <h2 style="margin-top:0;font-size:16px;color:#333;">Onboarding Screen Generator</h2>
      <textarea id="jsonInput" style="width:100%;height:150px;padding:8px;border:1px solid #ddd;border-radius:4px;font-family:monospace;font-size:12px;" placeholder="Paste your onboarding JSON here..."></textarea>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button onclick="sendData()" style="flex:1;padding:8px 12px;background:#18A0FB;color:white;border:none;border-radius:6px;font-weight:500;cursor:pointer;">Create Screens</button>
        <button onclick="loadSample()" style="padding:8px 12px;background:#F5F5F5;color:#333;border:1px solid #ddd;border-radius:6px;font-weight:500;cursor:pointer;">Load Sample</button>
      </div>
      <script>
        function sendData() {
          const input = document.getElementById('jsonInput').value;
          parent.postMessage({ pluginMessage: { type: 'create-screens', data: input } }, '*');
        }
        
        function loadSample() {
          const sample = [
            {
              "title": "Welcome",
              "components": [
                { "type": "symbol", "value": "✦" },
                { "type": "title", "text": "Stellar" },
                { "type": "subtitle", "text": "A social platform focused on relationship quality" },
                { "type": "progressBar", "progress": 20 },
                { "type": "button", "label": "Get Started" }
              ]
            },
            {
              "title": "Philosophy",
              "components": [
                { "type": "symbol", "value": "◐" },
                { "type": "title", "text": "Relationships > Profiles" },
                { "type": "subtitle", "text": "Find genuine compatibility rather than perfect individuals" },
                { "type": "featureHighlight", "text": "Chemistry beats perfect profiles" },
                { "type": "progressBar", "progress": 40 },
                { "type": "button", "label": "Learn More" }
              ]
            },
            {
              "title": "Accuracy",
              "components": [
                { "type": "symbol", "value": "◯" },
                { "type": "bigNumber", "text": "95%" },
                { "type": "title", "text": "Matching Accuracy" },
                { "type": "subtitle", "text": "Unique star sign algorithm matches compatible relationship patterns" },
                { "type": "featureHighlight", "text": "Like a movie script perfectly matched interactions" },
                { "type": "progressBar", "progress": 60 },
                { "type": "button", "label": "See How It Works" }
              ]
            },
            {
              "title": "Process",
              "components": [
                { "type": "symbol", "value": "△" },
                { "type": "title", "text": "Three Steps to Find Your Ideal Match" },
                { "type": "featureHighlight", "text": "1. Relationship Test" },
                { "type": "featureHighlight", "text": "2. Personal Profile" },
                { "type": "featureHighlight", "text": "3. Precise Matching" },
                { "type": "progressBar", "progress": 80 },
                { "type": "button", "label": "Ready to Start" }
              ]
            },
            {
              "title": "Ready",
              "components": [
                { "type": "symbol", "value": "◈" },
                { "type": "title", "text": "Ready to Begin?" },
                { "type": "subtitle", "text": "Discover your personal relationship code" },
                { "type": "featureHighlight", "text": "6 questions · 2 minutes" },
                { "type": "progressBar", "progress": 100 },
                { "type": "button", "label": "Start Relationship Test" },
                { "type": "secondaryButton", "label": "Learn More" }
              ]
            }
          ];
          document.getElementById('jsonInput').value = JSON.stringify(sample, null, 2);
        }
      </script>
    </body>
  </html>
`, { width: 360, height: 340 });

// 主函数：处理消息并创建屏幕
figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'create-screens') return;
  
  try {
    // 解析JSON数据
    let json;
    try {
      json = JSON.parse(msg.data);
    } catch (e) {
      figma.notify("⚠️ JSON格式无效", { error: true });
      return;
    }

    // 确保数据是数组
    const screens = Array.isArray(json) ? json : [json];
    if (screens.length === 0) {
      figma.notify("⚠️ 没有发现屏幕数据");
      return;
    }

    // 创建新页面
    const page = figma.createPage();
    page.name = "Onboarding Screens";
    figma.currentPage = page;

    // 加载所需字体
    await loadFonts();

    // 生成颜色方案
    const colorSchemes = generateColorSchemes(screens.length);
    
    // 存储所有屏幕和按钮的引用
    const screenRefs = [];
    const allButtons = [];
    
    // 创建每个屏幕
    for (let i = 0; i < screens.length; i++) {
      const screenData = screens[i];
      const colorScheme = colorSchemes[i];
      
      // 为每个屏幕创建一个独立的帧和结构
      const { frame, buttons } = await createScreenWithAutoLayout(screenData, i, colorScheme, page);
      
      screenRefs.push(frame);
      allButtons.push(buttons);
    }
    
    // 设置屏幕间导航
    setupNavigation(screenRefs, allButtons);
    
    figma.notify(`✅ 成功创建了 ${screens.length} 个入职屏幕!`);
    
  } catch (error) {
    console.error("创建屏幕时出错:", error);
    figma.notify(`❌ 错误: ${error.message}`, { error: true });
  }
};

// 加载所需字体
async function loadFonts() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Black" });
}

// 生成颜色方案
function generateColorSchemes(count) {
  const baseSchemes = [
    { 
      bg: { r: 0.996, g: 0.969, b: 1 },
      primary: { r: 1, g: 0.42, b: 0.616 },
      text: { r: 0.118, g: 0.161, b: 0.231 }
    },
    { 
      bg: { r: 0.941, g: 0.992, b: 0.98 },
      primary: { r: 0.306, g: 0.804, b: 0.769 },
      text: { r: 0.118, g: 0.161, b: 0.231 }
    },
    { 
      bg: { r: 0.941, g: 0.976, b: 1 },
      primary: { r: 0.271, g: 0.714, b: 0.82 },
      text: { r: 0.118, g: 0.161, b: 0.231 }
    },
    { 
      bg: { r: 0.941, g: 0.992, b: 0.957 },
      primary: { r: 0.588, g: 0.808, b: 0.706 },
      text: { r: 0.118, g: 0.161, b: 0.231 }
    },
    { 
      bg: { r: 1, g: 0.984, b: 0.922 },
      primary: { r: 0.996, g: 0.792, b: 0.341 },
      text: { r: 0.118, g: 0.161, b: 0.231 }
    }
  ];
  
  return Array.from({ length: count }, (_, i) => baseSchemes[i % baseSchemes.length]);
}

// 使用自动布局创建屏幕
async function createScreenWithAutoLayout(data, index, colorScheme, page) {
  // 创建主框架
  const frame = figma.createFrame();
  frame.resize(390, 844);
  frame.name = data.title || `Screen ${index + 1}`;
  frame.x = index * 420;
  frame.y = 0;
  frame.cornerRadius = 40;
  
  // 设置背景填充
  frame.fills = [{ 
    type: "SOLID", 
    color: colorScheme.bg
  }];
  
  // 添加到页面
  page.appendChild(frame);
  
  // 创建内容容器 - 使用自动布局
  const container = figma.createFrame();
  container.name = "Container";
  container.resize(310, 764);
  container.layoutMode = "VERTICAL";
  container.primaryAxisAlignItems = "CENTER";
  container.counterAxisAlignItems = "CENTER";
  container.itemSpacing = 24; // 减小间距，使元素更紧凑
  container.paddingTop = 40; // 减少顶部填充
  container.paddingBottom = 40; // 减少底部填充
  container.paddingLeft = container.paddingRight = 0;
  container.fills = [];
  container.x = 40;
  container.y = 40;
  
  frame.appendChild(container);
  
  // 创建上部区域 - 使用自动布局
  const topArea = figma.createFrame();
  topArea.name = "TopArea";
  topArea.layoutMode = "VERTICAL";
  topArea.primaryAxisAlignItems = "CENTER";
  topArea.counterAxisAlignItems = "CENTER";
  topArea.itemSpacing = 16; // 减小间距
  topArea.fills = [];
  
  // 先添加到父容器
  container.appendChild(topArea);
  // 然后再设置水平拉伸
  topArea.layoutSizingHorizontal = "FILL";
  
  // 创建中部区域 - 使用自动布局
  const middleArea = figma.createFrame();
  middleArea.name = "MiddleArea";
  middleArea.layoutMode = "VERTICAL";
  middleArea.primaryAxisAlignItems = "CENTER";
  middleArea.counterAxisAlignItems = "CENTER";
  middleArea.itemSpacing = 12; // 减小间距
  middleArea.paddingTop = middleArea.paddingBottom = 8; // 添加垂直内边距
  middleArea.fills = [];
  
  // 先添加到父容器
  container.appendChild(middleArea);
  // 然后再设置水平拉伸
  middleArea.layoutSizingHorizontal = "FILL";
  
  // 创建底部区域 - 使用自动布局
  const bottomArea = figma.createFrame();
  bottomArea.name = "BottomArea";
  bottomArea.layoutMode = "VERTICAL";
  bottomArea.primaryAxisAlignItems = "CENTER";
  bottomArea.counterAxisAlignItems = "CENTER";
  bottomArea.itemSpacing = 12; // 减小间距
  bottomArea.paddingTop = 16; // 添加顶部内边距
  bottomArea.fills = [];
  
  // 先添加到父容器
  container.appendChild(bottomArea);
  // 然后再设置水平拉伸
  bottomArea.layoutSizingHorizontal = "FILL";
  
  // 收集按钮引用
  const buttons = [];
  
  // 处理组件 - 分区域处理
  if (data.components && data.components.length > 0) {
    // 分类组件
    const topComponents = data.components.filter(c => ["symbol", "bigNumber", "title", "subtitle"].includes(c.type));
    const middleComponents = data.components.filter(c => ["featureHighlight"].includes(c.type));
    const bottomComponents = data.components.filter(c => ["progressBar", "button", "secondaryButton"].includes(c.type));
    
    // 处理顶部组件
    for (const component of topComponents) {
      const node = await createComponent(component, colorScheme);
      if (node) {
        // 先添加到父容器
        topArea.appendChild(node);
        
        // 对特定组件类型设置水平拉伸
        if (component.type === "title" || component.type === "subtitle" || 
            node.name === "TitleContainer" || node.name === "SubtitleContainer") {
          node.layoutSizingHorizontal = "FILL";
        }
      }
    }
    
    // 处理中部组件
    for (const component of middleComponents) {
      const node = await createComponent(component, colorScheme);
      if (node) {
        // 先添加到父容器
        middleArea.appendChild(node);
        // 然后再设置水平拉伸
        node.layoutSizingHorizontal = "FILL";
      }
    }
    
    // 处理底部组件
    for (const component of bottomComponents) {
      const node = await createComponent(component, colorScheme);
      if (node) {
        // 先添加到父容器
        bottomArea.appendChild(node);
        // 然后再设置水平拉伸
        node.layoutSizingHorizontal = "FILL";
        
        // 收集按钮引用
        if (component.type === "button" || component.type === "secondaryButton") {
          buttons.push({
            node: node,
            type: component.type,
            interaction: component.interaction || null
          });
        }
      }
    }
  }
  
  return { frame, buttons };
}

// 创建单个组件
async function createComponent(component, colorScheme) {
  try {
    switch (component.type) {
      case "symbol":
        return createSymbol(component, colorScheme);
        
      case "title":
        return createTitle(component, colorScheme);
        
      case "subtitle":
        return createSubtitle(component, colorScheme);
        
      case "bigNumber":
        return createBigNumber(component, colorScheme);
        
      case "featureHighlight":
        return createFeatureHighlight(component, colorScheme);
        
      case "progressBar":
        return createProgressBar(component, colorScheme);
        
      case "button":
      case "secondaryButton":
        return createButton(component, colorScheme);
        
      default:
        console.warn(`未知组件类型: ${component.type}`);
        return null;
    }
  } catch (error) {
    console.error(`创建组件 ${component.type} 时出错:`, error);
    return null;
  }
}

// 创建符号 - 使用矢量形状而非文本
function createSymbol(component, colorScheme) {
  // 创建容器
  const container = figma.createFrame();
  container.name = "Symbol";
  container.resize(100, 100);
  container.fills = [];
  container.layoutMode = "VERTICAL"; 
  container.primaryAxisAlignItems = "CENTER";
  container.counterAxisAlignItems = "CENTER";
  container.paddingTop = container.paddingBottom = 10; // 添加内边距
  
  // 创建矢量形状
  let shape;
  const value = component.value || "*";
  
  if (value === "✦" || value === "*") {
    shape = figma.createStar();
    shape.pointCount = 4;
    shape.innerRadius = 0.38;
  } 
  else if (value === "◐" || value === "O") {
    shape = figma.createEllipse();
  }
  else if (value === "◯" || value === "O") {
    shape = figma.createEllipse();
  }
  else if (value === "△" || value === "^") {
    shape = figma.createPolygon();
    shape.pointCount = 3;
  }
  else if (value === "◈" || value === "◇") {
    shape = figma.createPolygon();
    shape.pointCount = 4;
  }
  else {
    shape = figma.createEllipse();
  }
  
  // 设置形状属性
  shape.resize(80, 80);
  shape.fills = [{ type: "SOLID", color: colorScheme.primary }];
  
  container.appendChild(shape);
  return container;
}

// 创建标题
function createTitle(component, colorScheme) {
  const title = figma.createText();
  title.name = "Title";
  title.fontName = { family: "Inter", style: "Black" };
  title.characters = component.text || "Title";
  title.fontSize = 36;
  title.textAlignHorizontal = "CENTER";
  
  // 关键修复：增加宽度，确保即使较长的标题也不会被截断
  title.resize(280, figma.mixed);
  title.textAutoResize = "HEIGHT";
  
  // 确保文本清晰可见
  title.fills = [{ type: "SOLID", color: colorScheme.text }];
  
  // 创建一个包装容器，提供额外的间距
  const titleContainer = figma.createFrame();
  titleContainer.name = "TitleContainer";
  titleContainer.layoutMode = "VERTICAL";
  titleContainer.primaryAxisAlignItems = "CENTER";
  titleContainer.counterAxisAlignItems = "CENTER";
  titleContainer.paddingTop = titleContainer.paddingBottom = 4;
  titleContainer.paddingLeft = titleContainer.paddingRight = 4;
  titleContainer.fills = []; // 透明背景
  
  // 先添加标题到容器
  titleContainer.appendChild(title);
  
  return titleContainer;
}

// 创建副标题
function createSubtitle(component, colorScheme) {
  const subtitle = figma.createText();
  subtitle.name = "Subtitle";
  subtitle.fontName = { family: "Inter", style: "Regular" };
  subtitle.characters = component.text || "Subtitle";
  subtitle.fontSize = 18;
  subtitle.textAlignHorizontal = "CENTER";
  
  // 修改宽度限制并允许文本换行
  subtitle.resize(280, figma.mixed);
  subtitle.textAutoResize = "HEIGHT";
  
  subtitle.fills = [{ type: "SOLID", color: colorScheme.text }];
  subtitle.opacity = 0.7;
  
  // 创建容器以提供额外间距
  const subtitleContainer = figma.createFrame();
  subtitleContainer.name = "SubtitleContainer";
  subtitleContainer.layoutMode = "VERTICAL";
  subtitleContainer.primaryAxisAlignItems = "CENTER";
  subtitleContainer.counterAxisAlignItems = "CENTER";
  subtitleContainer.paddingTop = subtitleContainer.paddingBottom = 4;
  subtitleContainer.fills = [];
  
  // 先添加文本到容器
  subtitleContainer.appendChild(subtitle);
  
  return subtitleContainer;
}

// 创建大数字
function createBigNumber(component, colorScheme) {
  const bigNumber = figma.createText();
  bigNumber.name = "BigNumber";
  bigNumber.fontName = { family: "Inter", style: "Black" };
  bigNumber.characters = component.text || "95%";
  bigNumber.fontSize = 80;
  bigNumber.textAlignHorizontal = "CENTER";
  bigNumber.textAutoResize = "WIDTH_AND_HEIGHT";
  bigNumber.fills = [{ type: "SOLID", color: colorScheme.primary }];
  
  // 创建容器以提供额外间距
  const bigNumberContainer = figma.createFrame();
  bigNumberContainer.name = "BigNumberContainer";
  bigNumberContainer.layoutMode = "VERTICAL";
  bigNumberContainer.primaryAxisAlignItems = "CENTER";
  bigNumberContainer.counterAxisAlignItems = "CENTER";
  bigNumberContainer.paddingTop = bigNumberContainer.paddingBottom = 4;
  bigNumberContainer.fills = [];
  
  // 先添加文本到容器
  bigNumberContainer.appendChild(bigNumber);
  
  return bigNumberContainer;
}

// 创建特色亮点
function createFeatureHighlight(component, colorScheme) {
  // 创建容器
  const container = figma.createFrame();
  container.name = "FeatureHighlight";
  container.layoutMode = "VERTICAL";
  container.primaryAxisAlignItems = "CENTER";
  container.counterAxisAlignItems = "CENTER";
  container.paddingTop = container.paddingBottom = 16;
  container.paddingLeft = container.paddingRight = 16;
  container.itemSpacing = 0;
  container.cornerRadius = 24;
  container.fills = [{ type: "SOLID", color: colorScheme.primary }];
  container.opacity = 0.9;
  
  // 创建文本
  const highlightText = figma.createText();
  highlightText.name = "Text";
  highlightText.fontName = { family: "Inter", style: "Bold" };
  highlightText.characters = component.text || "Feature";
  highlightText.fontSize = 20;
  highlightText.textAlignHorizontal = "CENTER";
  
  // 设置文本尺寸
  highlightText.resize(240, figma.mixed);
  highlightText.textAutoResize = "HEIGHT";
  
  highlightText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  
  // 先添加文本到容器，然后再返回容器
  container.appendChild(highlightText);
  return container;
}

// 创建进度条
function createProgressBar(component, colorScheme) {
  // 创建容器
  const container = figma.createFrame();
  container.name = "ProgressBarContainer";
  container.layoutMode = "VERTICAL";
  container.primaryAxisAlignItems = "CENTER";
  container.counterAxisAlignItems = "CENTER";
  container.paddingTop = container.paddingBottom = 8;
  container.fills = [];
  
  // 创建背景
  const background = figma.createRectangle();
  background.name = "Background";
  background.resize(300, 8);
  background.cornerRadius = 4;
  background.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  background.opacity = 0.1;
  
  // 创建填充
  const progress = component.progress || 20;
  const fill = figma.createRectangle();
  fill.name = "Fill";
  fill.resize(300 * (progress / 100), 8);
  fill.cornerRadius = 4;
  fill.fills = [{ type: "SOLID", color: colorScheme.primary }];
  
  // 构建层级
  const barFrame = figma.createFrame();
  barFrame.name = "Bar";
  barFrame.resize(300, 8);
  barFrame.layoutMode = "NONE";
  barFrame.fills = [];

  barFrame.appendChild(background);
  barFrame.appendChild(fill);
  fill.x = 0;
  fill.y = 0;

  container.appendChild(barFrame);
  
  return container;
}

// 创建按钮
function createButton(component, colorScheme) {
  const isPrimary = component.type === "button";
  
  // 创建容器
  const container = figma.createFrame();
  container.name = isPrimary ? "PrimaryButton" : "SecondaryButton";
  container.layoutMode = "HORIZONTAL"; // 水平布局方便居中文本
  container.primaryAxisAlignItems = "CENTER";
  container.counterAxisAlignItems = "CENTER";
  container.paddingTop = container.paddingBottom = 16;
  container.paddingLeft = container.paddingRight = 16;
  container.cornerRadius = 16;
  
  if (isPrimary) {
    container.fills = [{ type: "SOLID", color: colorScheme.primary }];
  } else {
    container.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    container.opacity = 0.6;
    container.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    container.strokeWeight = 1;
  }
  
  // 创建文本
  const buttonText = figma.createText();
  buttonText.name = "Label";
  buttonText.fontName = { family: "Inter", style: "Bold" };
  buttonText.characters = component.label || "Button";
  buttonText.fontSize = 16;
  buttonText.textAlignHorizontal = "CENTER";
  buttonText.textAutoResize = "WIDTH_AND_HEIGHT";
  
  if (isPrimary) {
    buttonText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  } else {
    buttonText.fills = [{ type: "SOLID", color: colorScheme.text }];
    buttonText.opacity = 0.8;
  }
  
  // 先将文本添加到容器
  container.appendChild(buttonText);
  return container;
}

// 设置导航
function setupNavigation(screenRefs, allButtons) {
  try {
    for (let i = 0; i < screenRefs.length - 1; i++) {
      const buttons = allButtons[i] || [];
      const nextScreen = screenRefs[i + 1];
      
      // 查找主按钮
      const mainButton = buttons.find(b => b.type === "button");
      
      if (mainButton && nextScreen) {
        try {
          // 创建导航
          mainButton.node.reactions = [{
            action: {
              type: "NODE",
              destinationId: nextScreen.id,
              navigation: "NAVIGATE"
            },
            trigger: {
              type: "ON_CLICK"
            }
          }];
        } catch (error) {
          console.warn("设置导航时出错:", error);
        }
      }
    }
  } catch (error) {
    console.warn("设置屏幕间导航时出错:", error);
  }
}
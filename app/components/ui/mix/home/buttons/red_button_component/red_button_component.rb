class Ui::Mix::Home::Buttons::RedButtonComponent::RedButtonComponent < ViewComponent::Base
  def css_class
    self.class.name.underscore.gsub('_', '-').gsub('/', '--').split('--')[0..-2].join('--')
  end
end
